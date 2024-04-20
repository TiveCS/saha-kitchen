"use client";

import {
  Card,
  CardBody,
  Pagination as NextPagination,
} from "@nextui-org/react";
import { useMemo } from "react";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  rowsPerPage?: number;
  count?: number;
}

export function Pagination({
  count = 0,
  setPage,
  page,
  rowsPerPage = 8,
}: PaginationProps) {
  const pages = useMemo(
    () => Math.ceil(count / rowsPerPage),
    [count, rowsPerPage]
  );

  return (
    <>
      {count > 0 ? (
        <Card className="py-2 px-2">
          <CardBody className="flex flex-row justify-between items-center">
            <NextPagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
            />

            <div>
              <p className="text-default-400 text-small">
                Menampilkan {Math.min(page * rowsPerPage, count)} dari {count}{" "}
                data
              </p>
            </div>
          </CardBody>
        </Card>
      ) : null}
    </>
  );
}
